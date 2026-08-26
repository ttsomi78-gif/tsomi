import { NewProductForm } from "../new-product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-2 font-display text-3xl uppercase tracking-wide">
        New product
      </h1>
      <p className="mb-8 text-sm text-ink/55">
        Name, category and price — then one block per color with its photos,
        sizes and quantities. One click creates everything.
      </p>
      <NewProductForm />
    </div>
  );
}
