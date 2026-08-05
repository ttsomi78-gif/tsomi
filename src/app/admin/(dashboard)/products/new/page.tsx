import { ProductForm } from "../product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl uppercase tracking-wide">
        New product
      </h1>
      <ProductForm />
    </div>
  );
}
