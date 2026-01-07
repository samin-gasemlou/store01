import { useState } from "react";
import ProductReviews from "../singleProduct/ProductReviews";
export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("specs");

  return (
    <section className="w-full mx-auto md:px-4 mt-16 mb-4">

      {/* TABS HEADER */}
      <div className="flex md:flex-wrap gap-3 w-full">
        <TabButton
          active={activeTab === "specs"}
          onClick={() => setActiveTab("specs")}
        >
          Specifications
        </TabButton>

        <TabButton
          active={activeTab === "desc"}
          onClick={() => setActiveTab("desc")}
        >
          Description
        </TabButton>

        <TabButton
          active={activeTab === "reviews"}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews 
        </TabButton>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-tr-3xl rounded-bl-3xl rounded-br-3xl p-6 sm:p-10 w-full">

        {/* SPECIFICATIONS */}
        {activeTab === "specs" && (
          <>
            <h3 className="text-xl font-semibold mb-6">
              Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 text-sm sm:text-base">

              <SpecRow label="Fragrance Notes" value="Top Notes" />
              <SpecRow label="Longevity" value="Moderate" />
              <SpecRow label="Projection" value="Strong" />
              <SpecRow label="Best Season" value="Summer / Winter" />

            </div>
          </>
        )}

        {/* DESCRIPTION */}
        {activeTab === "desc" && (
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base w-full">
            {product.description}
          </p>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <ProductReviews />
        )}

      </div>
    </section>
  );
}

/* ---------- Components ---------- */

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        md:px-6 px-2 py-2 md:py-3 md:w-[190px] rounded-t-xl md:text-sm text-[14px] sm:text-base border
        transition
        ${
          active
            ? "bg-[#2B4168] text-white border-[#2B4168]"
            : "bg-transparent text-[#2B4168] border-[#2B4168] hover:bg-[#2b416838]"
        }
      `}
    >
      {children}
    </button>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-6 border-b border-gray-100 pb-4">
      <span className="font-medium w-48">
        {label}
      </span>
      <span className="text-gray-600">
        {value}
      </span>
    </div>
  );
}
