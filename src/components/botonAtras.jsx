import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function BotonAtras () {

    const navigate = useNavigate();

    const irAtras = () =>{
      navigate(-1)
    }

    const m = "< Regresar"

  return (
<div className="relative left-3/4 mt-1">
  <button
    type="button"
    className="border border-gray-400 bg-white hover:bg-[#00304D] hover:text-white  top-0 right-0  rounded-3xl p-1 w-40 bg-gradient-to-t from-transparent to-[rgba(0,0,0,0.4)] font-bold text-[#00304D] "
    onClick={irAtras}
  >
    {m}
  </button>
</div>
  )
}
