import { NewProductForm } from "../new-product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-2 text-xl font-semibold tracking-tight">New product</h1>
      <p className="mb-8 text-sm text-gray-500">
        Name, category and price — then one block per color with its photos,
        sizes and quantities. One click creates everything.
      </p>
      <NewProductForm />
    </div>
  );
}
