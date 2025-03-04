import { notFound } from "next/navigation";

import { db } from "../../../../lib/prisma";
import ProductHeader from "./components/pruduct-header";

interface ProductPageProps {
  params: {
    slug: string;
    productid: string;
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productid } = await params;
  const product = await db.product.findUnique({ where: { id: productid } });
  if (!product) {
    return notFound();
  }
  return (
    <>
      <ProductHeader product={product} />
      <h1>ProductPage</h1>
      {slug}
      {productid}
    </>
  );
};

export default ProductPage;
