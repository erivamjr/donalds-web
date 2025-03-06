import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import { formatCurrency } from "../../../../helpers/formar-currency";

interface OrderListProps {
  orders: Prisma.OrderGetPayload<{
    include: {
      restaurant: { select: { name: true; avatarImageUrl: true } };
      orderProducts: { include: { product: true } };
    };
  }>[];
}

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.FINISHED:
      return "Finalizado";
    case OrderStatus.PENDING:
      return "Pendente";
    case OrderStatus.IN_PREPARATION:
      return "Em preparo";
  }
};

const OrderList = ({ orders }: OrderListProps) => {
  return (
    <div className="space-y-6 p-6">
      <Button size={"icon"} variant={"secondary"} className="rounded-full">
        <ChevronLeftIcon />
      </Button>

      <div className="flex items-center gap-3">
        <ScrollTextIcon />
        <h2 className="text-lg font-semibold">Meus pedidos</h2>
      </div>

      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="space-y-4 p-5">
            <div
              className={`w-fit rounded-full px-2 py-1 text-xs font-semibold text-white ${
                order.status === OrderStatus.FINISHED
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {getStatusLabel(order.status)}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5">
                <Image
                  src={order.restaurant.avatarImageUrl}
                  alt={order.restaurant.name}
                  fill
                  className="rounded-sm"
                />
              </div>
              <p className="text-sm font-semibold">{order.restaurant.name}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              {order.orderProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white">
                    {product.quantity}
                  </div>
                  <p className="text-sm">{product.product.name}</p>
                </div>
              ))}
            </div>
            <Separator />
            <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderList;
