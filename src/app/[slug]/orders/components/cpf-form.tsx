"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
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
import { isValidCpf, removeCpfPunctuation } from "../../../../helpers/cpf";

const formSchema = z.object({
  cpf: z
    .string()
    .trim()
    .min(11, { message: "O CPF é obrigatorio" })
    .refine((value) => isValidCpf(value), {
      message: "CPF inválido",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const CpfForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const pathname = usePathname();
  const onSubmit = (data: FormSchema) =>
    router.replace(`${pathname}?cpf=${removeCpfPunctuation(data.cpf)}`);
  const handleCancel = () => router.back();

  return (
    <Drawer open>
      <DrawerTrigger></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Vizualizar Pedidos</DrawerTitle>
          <DrawerDescription>
            Insira seu cpf abaixo para vizualizar seus pedidos
          </DrawerDescription>
        </DrawerHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem className="px-4">
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
                <Button variant={"destructive"} className="w-full rounded-full">
                  Confirmar
                </Button>
                <DrawerClose>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={handleCancel}
                  >
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

export default CpfForm;
