import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white w-full border-t-2 border-white pt-12 pb-8 px-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Column 1: About Us */}
        <div>
          <h2 className="font-display font-black text-xl uppercase mb-4 text-[#fadadd]">ABOUT US</h2>
        </div>

        {/* Column 2: Contact Us */}
        <div>
          <Link to="/"> <p className="hover:text-orange-400 transition-colors font-display font-black text-lg uppercase mb-4 text-[#fadadd]">CONTACT US</p> </Link>
          
        </div>

        {/* Column 3: Return Policy */}
        <div>
          <Link to="/"><p className="font-display font-black text-lg uppercase mb-4 text-[#fadadd] hover:text-orange-400 transition-colors">RETURN POLICY</p></Link>
          
        </div>

        {/* Column 4: Help */}
        <div>
          <p className="font-display font-black text-xl uppercase mb-4 text-[#fadadd]">HELP</p>
          <ul className="font-sans text-base font-medium leading-loose space-y-2 cursor-pointer">
            <li className="hover:text-orange-400 transition-colors">FAQ</li>
            <li className="hover:text-orange-400 transition-colors">Shipping Information</li>
            <li className="hover:text-orange-400 transition-colors">Size Guide</li>
            <li className="hover:text-orange-400 transition-colors">Track My Order</li>
            <li className="hover:text-orange-400 transition-colors">Wholesale Inquiries</li>
          </ul>
        </div>
      </div>

      {/* Separator */}
      <hr className="border-t-[3px] border-white/20 my-8 max-w-[1400px] mx-auto border-dashed" />

      {/* Copyright & Legal */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center font-sans font-bold text-sm opacity-70">
        <div className="mb-4 md:mb-0">
          © 2026 Sock🧦y. All rights reserved.
        </div>
        <div className="space-x-4 text-sm flex items-center">
          <Link to="/" className="hover:text-orange-400">Privacy Policy</Link>
          <span className="opacity-50">|</span>
          <Link to="/" className="hover:text-orange-400">Terms of Service</Link>
          <span className="opacity-50">|</span>
          <Link to="/" className="hover:text-orange-400">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
