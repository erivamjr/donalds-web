"use client";

import { z } from "zod";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatorio" }),
  cpf: z
    .string()
    .trim()
    .min(11, { message: "O CPF é obrigatorio" })
    .refine((value) => isValidCpf(value), {
      message: "CPF inválido",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumptionMethod } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";

import { Button } from "../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { isValidCpf } from "../../../../helpers/cpf";
import { createOrder } from "../actions/create-order";
import { CartContext } from "../context/cart";

interface FinishedOrderButtonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FinishedOrderDialog = ({
  open,
  onOpenChange,
}: FinishedOrderButtonProps) => {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const { products } = useContext(CartContext);
  const [isPendding, startTransition] = useTransition();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cpf: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const consumptionMethod = searchParams.get(
        "consumptionMethod",
      ) as ConsumptionMethod;

      startTransition(async () => {
        await createOrder({
          consumptionMethod,
          customerCpf: data.cpf,
          customerName: data.name,
          products,
          slug,
        });
        onOpenChange(false);
        toast.success("Pedido realizado com sucesso!");
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finalizar o pedido</DrawerTitle>
          <DrawerDescription>
            Insira suas informações abaixo para finalizar o seu pedido.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu CPF</FormLabel>
                    <FormControl>
                      <PatternFormat
                        placeholder="Digite seu CPF..."
                        {...field}
                        format="###.###.###-##"
                        customInput={Input}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerFooter>
                <Button
                  type="submit"
                  variant={"destructive"}
                  className="rounded-full"
                  disabled={isPendding}
                >
                  {isPendding && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Finalizar
                </Button>
                <DrawerClose>
                  <Button className="w-full rounded-full" variant="outline">
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FinishedOrderDialog;
