export default function IconBtn({ text, onClick }) {
   return (
     <button
       onClick={onClick}
       className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition"
     >
       {text}
     </button>
   );
 }
 
 