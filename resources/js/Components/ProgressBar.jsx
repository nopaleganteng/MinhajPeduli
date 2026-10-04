import React from "react";

export default function ProgressBar({ step = 1 }) {
    // step: 1=form, 2=pembayaran, 3=selesai
    return (
        <div className="flex justify-center items-center mb-10 md:mb-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
                <div className={`text-[11px] sm:text-sm font-bold mb-2 whitespace-nowrap ${step === 1 ? 'text-gray-700' : 'text-gray-400'}`}>Formulir Donasi</div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md ring-4 ring-green-100 transition-all ${step === 1 ? 'bg-[#4ade80] text-white' : step > 1 ? 'bg-[#4ade80] text-white opacity-70' : 'bg-gray-200 text-gray-500'}`}>1</div>
            </div>
            <div className={`h-1 w-10 sm:w-24 md:w-48 ${step > 1 ? 'bg-[#4ade80]' : 'bg-gray-200'} -mx-3 sm:-mx-4 mt-6 transition-all`}></div>
            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
                <div className={`text-[11px] sm:text-sm font-bold mb-2 whitespace-nowrap ${step === 2 ? 'text-gray-800' : 'text-gray-400'}`}>Pembayaran</div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all ${step === 2 ? 'bg-[#4ade80] text-white ring-4 ring-green-100 scale-110' : step > 2 ? 'bg-[#4ade80] text-white opacity-70' : 'bg-gray-200 text-gray-500'}`}>2</div>
            </div>
            <div className={`h-1 w-10 sm:w-24 md:w-48 ${step > 2 ? 'bg-[#4ade80]' : 'bg-gray-200'} -mx-3 sm:-mx-4 mt-6 transition-all`}></div>
            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
                <div className={`text-[11px] sm:text-sm font-bold mb-2 whitespace-nowrap ${step === 3 ? 'text-gray-800' : 'text-gray-400'}`}>Selesai</div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all ${step === 3 ? 'bg-[#4ade80] text-white ring-4 ring-green-100 scale-110' : 'bg-gray-200 text-gray-500'}`}>3</div>
            </div>
        </div>
    );
}
