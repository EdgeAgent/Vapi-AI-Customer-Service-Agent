import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getUserVapiAgents, getVapiAgentById, createVapiAgent, updateVapiAgent, deleteVapiAgent, getAgentCallLogs, createCallLog } from "./db";
import VapiService from "./services/vapiService";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  vapi: router({
    agents: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        const agents = await getUserVapiAgents(ctx.user.id);
        return agents.map((agent: any) => ({
          ...agent,
          apiKey: agent.apiKey ? '***' : undefined,
        }));
      }),
      
      create: protectedProcedure
        .input(z.object({
          agentName: z.string().min(1),
          agentId: z.string().min(1),
          apiKey: z.string().min(1),
          publicKey: z.string().optional(),
          assistantId: z.string().optional(),
          phoneNumber: z.string().optional(),
          description: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          try {
            const vapiService = new VapiService(input.apiKey);
            
            // Verify the API key by fetching agent details
            if (input.agentId) {
              await vapiService.getAgent(input.agentId);
            }
            
            // Store the agent configuration in database
            const result = await createVapiAgent({
              userId: ctx.user.id,
              ...input,
              isActive: 'true',
            });
            return result;
          } catch (error: any) {
            throw new Error(`Failed to create agent: ${error.message}`);
          }
        }),
      
      get: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const agent = await getVapiAgentById(input.id);
          if (!agent) return null;
          
          try {
            const vapiService = new VapiService(agent.apiKey);
            const vapiAgent = await vapiService.getAgent(agent.agentId);
            
            return {
              ...agent,
              apiKey: agent.apiKey ? '***' : undefined,
              vapiDetails: vapiAgent,
            };
          } catch (error) {
            // Return local data if Vapi API call fails
            return {
              ...agent,
              apiKey: agent.apiKey ? '***' : undefined,
            };
          }
        }),
      
      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          agentName: z.string().optional(),
          phoneNumber: z.string().optional(),
          description: z.string().optional(),
          isActive: z.enum(['true', 'false']).optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...updates } = input;
          return await updateVapiAgent(id, updates);
        }),
      
      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return await deleteVapiAgent(input.id);
        }),
    }),
    
    callLogs: router({
      list: protectedProcedure
        .input(z.object({ agentId: z.number() }))
        .query(async ({ input }) => {
          return await getAgentCallLogs(input.agentId);
        }),
      
      create: publicProcedure
        .input(z.object({
          agentId: z.number(),
          callId: z.string(),
          callerNumber: z.string().optional(),
          duration: z.number().optional(),
          status: z.string().optional(),
          transcript: z.string().optional(),
          recordingUrl: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          return await createCallLog(input);
        }),
    }),

    calls: router({
      initiate: protectedProcedure
        .input(z.object({
          agentId: z.number(),
          customerNumber: z.string(),
          assistantId: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          try {
            const agent = await getVapiAgentById(input.agentId);
            if (!agent || agent.userId !== ctx.user.id) {
              throw new Error('Agent not found or unauthorized');
            }
            
            const vapiService = new VapiService(agent.apiKey);
            const call = await vapiService.createCall({
              agentId: agent.agentId,
              customerNumber: input.customerNumber,
              assistantId: input.assistantId || agent.assistantId || undefined,
            });
            
            // Log the call
            await createCallLog({
              agentId: input.agentId,
              callId: call.id || `call_${Date.now()}`,
              callerNumber: input.customerNumber,
              status: 'initiated',
            });
            
            return call;
          } catch (error: any) {
            throw new Error(`Failed to create call: ${error.message}`);
          }
        }),
      
      status: protectedProcedure
        .input(z.object({
          agentId: z.number(),
          callId: z.string(),
        }))
        .query(async ({ input, ctx }) => {
          try {
            const agent = await getVapiAgentById(input.agentId);
            if (!agent || agent.userId !== ctx.user.id) {
              throw new Error('Agent not found or unauthorized');
            }
            
            const vapiService = new VapiService(agent.apiKey);
            return await vapiService.getCall(input.callId);
          } catch (error: any) {
            throw new Error(`Failed to get call: ${error.message}`);
          }
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;

