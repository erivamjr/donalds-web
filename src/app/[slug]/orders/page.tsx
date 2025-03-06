import { isValidCpf, removeCpfPunctuation } from "../../../helpers/cpf";
import { db } from "../../../lib/prisma";
import CpfForm from "./components/cpf-form";
import OrderList from "./components/order-list";

interface OrdersPageProps {
  searchParams: Promise<{ cpf: string }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { cpf } = await searchParams;
  if (!cpf || !isValidCpf(cpf)) {
    return <CpfForm />;
  }

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      customerCpf: removeCpfPunctuation(cpf),
    },
    include: {
      restaurant: { select: { name: true, avatarImageUrl: true } },
      orderProducts: { include: { product: true } },
    },
  });
  return <OrderList orders={orders} />;
};

export default OrdersPage;
