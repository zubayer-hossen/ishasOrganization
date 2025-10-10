// src/components/common/Headlines.jsx
export default function Headlines({ headlines }) {
  return (
    <div className="bg-yellow-200 text-black p-3 rounded shadow mt-6">
      <marquee behavior="scroll" direction="left" scrollamount="5">
        {headlines.join(" | ")}
      </marquee>
    </div>
  );
}
