import { useFormikContext } from "formik";
import Button from "../../Button";

function FormBtn({ disabled, title, loading = false }) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button
      disabled={disabled}
      className="w-full py-3 bg-primary hover:bg-green-900 text-white hover:text-slate-50"
      title={title}
      loading={loading}
      onClick={handleSubmit}
      type="button"
    />
  );
}

export default FormBtn;
