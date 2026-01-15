import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import { generatePix, checkPaymentStatus } from './payment';

export const paymentRouter = router({
  /**
   * Gera um código PIX para pagamento
   */
  generatePix: publicProcedure
    .input(
      z.object({
        amount: z.number().positive(), // em centavos
        cpf: z.string(),
        customerName: z.string(),
        customerEmail: z.string(),
        productName: z.string(),
        utms: z.object({
          utm_source: z.string().optional(),
          utm_medium: z.string().optional(),
          utm_campaign: z.string().optional(),
          utm_content: z.string().optional(),
          utm_term: z.string().optional(),
          xcod: z.string().optional(),
          sck: z.string().optional(),
          fbclid: z.string().optional(),
          gclid: z.string().optional(),
          src: z.string().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await generatePix({
        amount: input.amount,
        cpf: input.cpf,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        productName: input.productName,
        utms: input.utms || {},
      });

      if (!result.success) {
        throw new Error(result.error || 'Erro ao gerar PIX');
      }

      return {
        pixCode: result.pixCode!,
        transactionId: result.transactionId!,
        qrCodeUrl: result.qrCodeUrl!,
      };
    }),

  /**
   * Verifica o status de um pagamento PIX
   */
  checkStatus: publicProcedure
    .input(
      z.object({
        transactionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await checkPaymentStatus(input.transactionId);
      return result;
    }),
});
