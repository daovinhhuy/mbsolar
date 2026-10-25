import Link from "next/link";
import Image from "next/image";
import logoMb from "@/public/image/logoMB.png";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid">
        <div>
          <Link className="logo" href="/">
            <Image src={logoMb} alt="MB Solar" priority />
          </Link>
          <p className="footer-intro">
            CÔNG TY TNHH XÂY LẮP ĐIỆN CÔNG NGHIỆP NĂNG LƯỢNG MẶT TRỜI MB SOLAR
          </p>
          
        </div>
        <div className="footer-contact-info">
          <h4>THÔNG TIN LIÊN HỆ</h4>
          <p className="contact-line">
            <strong>📍Địa chỉ:</strong> D7-44, Đường 15, KDC 586, phường Hưng
            Phú, TP. Cần Thơ
          </p>
          <p className="contact-line">
            <strong>🧾 Mã số thuế:</strong> 1801779076
          </p>
          <p className="contact-line">
            <strong>☎ Điện thoại/Zalo:</strong> 094 504 68 07
          </p>
          <span className="footer-email-line">
            <strong>✉ Email:</strong>{" "}
            <a href="mailto:nangluongmbsolar@gmail.com">
              nangluongmbsolar@gmail.com
            </a>
          </span>
    
        </div>
        <div className="footer-map">
          <iframe
            title="Bản đồ vị trí MB Solar"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0932074447724!2d105.80495879999997!3d10.009159499999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a063007487bdff%3A0xbeee23addafabf65!2zQ8O0bmcgVHkgVE5ISCBYw6J5IEzhuq9wIMSQaeG7h24gQ8O0bmcgTmdoaeG7h3AgTsSDbmcgTMaw4bujbmcgTUIgU29sYXI!5e0!3m2!1sen!2s!4v1792301195916!5m2!1sen!2s"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </footer>
  );
}
