import React from "react";
import Image from "next/image";

const Cpdf = () => {
  return (
    <div class="page-content" onload={window.print()}>
      <div class="container-fluid">
        <div class="inner-page-content">
          <div class="section-heading d-none d-sm-inline-block">
            <h6>Parcel Id #80926988</h6>
          </div>
          <div class="common-form">
            <div class="label-printing">
              <div class="labelprint-btn d-flex justify-content-end align-items-end">
                <button class="btn btn-sm" onclick={window.print()}>
                  {" "}
                  Print
                </button>
              </div>
              <div class="parcel-label d-flex flex-column align-items-center justify-content-between">
                <div class="label-top">
                  <div class="label-logo d-flex justify-content-center align-items-center">
                    <Image
                      href="/assets/images/logo/marchant_logo_lg.svg"
                      alt=""
                    />
                  </div>
                </div>
                <div class="label-body">
                  <div class="mrcnt-name d-flex flex-column justify-content-center align-items-center">
                    <p>Rajshahir Aam Wala</p>
                    <p>ID:141700</p>
                    <div class="barcode w-100">
                      <Image
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAAeAQMAAABnrVXaAAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADJJREFUOI1jOHD+/Jk/B86fOcN//sz5AyB85s/5A3/A7D9QDFLDMKpwVOGowlGFg1khAIMHuqyUn+vdAAAAAElFTkSuQmCC"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="parcel-qrcode mt-2 d-flex gap-3 justify-content-center">
                    <Image
                      href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA/AQMAAABtkYKcAAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAKBJREFUKJF10rENxCAMBVCfrmcCpKxBx0pMwHELcCulyxqWWCDXpUD4bF0q8uPqFZbxtyCRQ0aUQVcwhZ4DOYA2wrIHqRg+34Idhk5u5Xxigu7T6rnYBC3Z6V8T5H2ICGeA/tiYyCcAcrGTBgGQz8q6lQPgFD0FygC2yVc8gqag19YRNLv2LBVAL/bUGOMGxeZDWIoBYHfW+QnAfkKxngt+f74SJMd/lIsAAAAASUVORK5CYII="
                      alt=""
                    />
                    <div class="d-flex gap-1 flex-column">
                      <p>ID : 80926988</p>
                      <p>D. Type : Home </p>
                      <p>WGT : 2 KG </p>
                    </div>
                  </div>
                  <div class="customer-info d-flex flex-column gap-1 mt-2">
                    <p>Name : সিয়াম </p>
                    <p>Phone : 01722166051 </p>
                    <p>Address : কাহালু উপজেলা, কাহালু বগুড়া </p>
                  </div>
                  <div class="cod d-flex mt-2">
                    <div class="w-50 d-flex align-items-center">
                      <p>COD</p>
                    </div>
                    <div class="w-50 d-flex align-items-center justify-content-end">
                      <p>0 </p>
                    </div>
                  </div>
                </div>
                <div class="label-footer d-flex justify-content-between align-items-end w-100 mt-2">
                  <div class="time">
                    <p>P: 16/04/24 11:01am</p>
                  </div>
                  <div class="power-by d-flex flex-column justify-content-end gap-1">
                    <Image
                      href="/assets/images/power_by_logo.svg"
                      alt=""
                      class="w-auto h-auto"
                    />
                    <p>www.steadfast.com.bd</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cpdf;
