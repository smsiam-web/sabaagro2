import { useFormikContext } from "formik";
import Button from "../../Button";

function FormBtn({
  className = "",
  icon = null,
  title = "title",
  loading = false,
  ...rest
}) {
  const { handleSubmit } = useFormikContext();
  console.log(loading);

  return (
    <Button
      className={`w-full py-3 bg-primary hover:bg-green-900 shadow-lg ${className}`}
      {...rest}
      title={title}
      loading={loading}
      onClick={handleSubmit}
      type="button"
    />
  );
}

export default FormBtn;
