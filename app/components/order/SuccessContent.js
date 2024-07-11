import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Button from "../shared/Button";

const SuccessContent = () => {
  const [isTracking, setIsTracking] = React.useState(false);
  const router = useRouter();
  const { order_id } = router.query;

  useEffect(() => {
    setTimeout(() => {
      setIsTracking(true);
    }, 4000);
  }, []);

  return (
    <div className="mb-5 ">
      {!isTracking ? (
        <>
          <img
            src="/images/order/success.gif"
            loading="lazy"
            alt=""
            className="mx-auto w-1/2"
          />
          <h2 className="text-center text-lg">
            Thank you. Your payment was successful *^____^*
          </h2>
          <h2 className="text-center text-base  mt-2">Processing order...</h2>
        </>
      ) : (
        <>
          <img
            src="/images/order/order-done.gif"
            loading="lazy"
            alt=""
            className="mx-auto w-1/2 rounded-2xl"
          />
          <h2 className="text-center text-base mt-6 font-bold">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। কিছুক্ষণের মধ্যে আপনাকে ফোন
            করা হবে।
          </h2>
          <h2 className="text-center text-base mt-2">
            Your order is on it&apos;s way 🏃
          </h2>
          <h2 className="text-center text-base mt-2">
            <strong>Order id: </strong>
            {order_id}
          </h2>
          <Button
            onClick={() =>
              router.push(`/my-account/orders?order_id=${order_id}`)
            }
            title="View Orders"
            className="md:w-1/2 w-full mx-auto py-3 mt-5 block bg-black text-white uppercase"
          ></Button>
        </>
      )}
    </div>
  );
};

export default SuccessContent;
