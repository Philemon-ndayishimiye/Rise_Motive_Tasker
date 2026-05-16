import { Phone, Mail, MapPin } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTwitter, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      <footer className="bg-blue-800 ">
        {/* CTA Section */}
        <div className="max-w-3xl mx-auto px-6 pt-5 pb-5 flex flex-col items-center text-center gap-6">
          <span className="text-md font-bold tracking-[0.2em] uppercase text-white font-family-playfair">
            Final Call to Action
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug font-family-playfair">
            Join The Rise Motive Ecosystem
          </h2>

          <p className="text-base text-blue-100 max-w-xl leading-relaxed font-family-playfair">
            Whether you want to:{" "}
            <strong className="text-white font-semibold">
              Learn new skills
            </strong>
            ,{" "}
            <strong className="text-white font-semibold">
              Request services
            </strong>
            , <strong className="text-white font-semibold">Buy tools</strong>,
            or <br className="hidden sm:block" />
            <strong className="text-white font-semibold">
              Access opportunities
            </strong>
            , Rise Motive is here for you.
          </p>
        </div>

        {/* Divider */}
        <div className="border-white/20 max-w-4xl mx-auto" />
      </footer>

      {/* Main Footer Grid */}
      <div className=" bg-blue-800 px-6 sm:py-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-white">
          {/* Brand & Social */}
          <div>
            <NavLink to="/" className="flex items-center gap-3 group mb-4">
              <h2 className="font-extrabold tracking-wide text-[18px] text-whitegroup-hover:text-blue-500 transition-colors duration-200 pb-2 font-family-playfair">
                RISEMOTIVE
              </h2>
            </NavLink>

            <p className="text-[13px] font-family-playfair text-white">
              Rise Motive Ltd builds systems that empower communities to learn,
              create.
            </p>

            <div className="flex gap-4 mt-5">
              <FaTwitter
                className="text-white text-2xl cursor-pointer"
                onClick={() =>
                  window.open(" https://x.com/risemotive_rw", "_blank")
                }
              />
              <FaInstagram
                className="text-white text-2xl cursor-pointer"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/risemotive_rm?igsh=MWtobjFnazQxbTRnbA==",
                    "_blank",
                  )
                }
              />
              <FaWhatsapp
                className="text-white text-2xl cursor-pointer"
                onClick={() =>
                  window.open(
                    "https://whatsapp.com/channel/0029Vb7SVEm3WHTc1WqfaD1M",
                    "_blank",
                  )
                }
              />
              <FaTiktok
                className="text-white text-2xl cursor-pointer"
                onClick={() =>
                  window.open(
                    " https://www.tiktok.com/@risemotive_rw?_r=1&_t=ZS-95UBM13E7cO",
                  )
                }
              />
            </div>
          </div>

          {/* About */}
          <div>
            <h1 className="font-family-playfair text-[18px] text-white font-bold pb-3">
              About Our Company
            </h1>
            <p
              onClick={() => navigate("/#whoWeAre")}
              className="font-family-playfair cursor-pointer pb-3 text-[14px] text-white font-medium"
            >
              Who We Are
            </p>
            <p
              onClick={() => navigate("/#proffessionals")}
              className="font-family-playfair cursor-pointer pb-3 text-[14px] text-white font-medium"
            >
              Proffessionals
            </p>
            <p
              onClick={() => navigate("/#clusters")}
              className="font-family-playfair cursor-pointer pb-3 text-[14px] text-white font-medium"
            >
              Clusters
            </p>
          </div>

          {/* Contact */}
          <div>
            <h1 className="font-family-playfair text-[18px] text-white font-bold pb-3">
              Contact Us
            </h1>
            <div className="flex items-center gap-2 pb-3">
              <Phone size={17} />
              <p className="text-[14px] text-white">
                +250795344768 | +250788625873
              </p>
            </div>
            <div className="flex items-center gap-2 pb-3">
              <Mail size={17} />
              <p className="text-[14px] text-white">
                tasks.risemotive@gmail.com
              </p>
            </div>
            <div className="flex items-center gap-2 pb-3">
              <MapPin size={17} />
              <p className="text-[14px] text-white">
                Kicukiro District, Nyarugunga Sector
              </p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h1 className="font-family-playfair  text-[18px] text-white font-bold pb-3">
              Legal
            </h1>
            <p
              onClick={() => navigate("/privacy")}
              className="font-family-playfair pb-3 cursor-pointer text-[14px] text-white font-medium"
            >
              Privacy Policy
            </p>
            <p
              onClick={() => navigate("/terms")}
              className="font-family-playfair pb-3 text-[14px] cursor-pointer text-white font-medium"
            >
              Terms and Conditions
            </p>
            <p
              onClick={() => navigate("/lawyer")}
              className="font-family-playfair cursor-pointer pb-3 text-[14px] text-white font-medium"
            >
              Lawyer's Corner
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-blue-800  border-white/20 py-3 text-center text-sm text-white font-family-poppins">
        © {new Date().getFullYear()} Risemotive. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
