export default function SocialContactButtons() {
  return (
    <nav className="social-contact" aria-label="Liên hệ nhanh">
      <a
        className="social-contact__link"
        href="https://www.facebook.com/nlmt.mbsolar"
        target="_blank"
        rel="noreferrer"
        aria-label="Nhắn tin cho MB Solar qua Facebook"
        title="Nhắn tin qua Facebook"
      >
        <span className="social-contact__icon social-contact__icon--facebook" aria-hidden="true">
          <svg viewBox="0 0 48 48" role="presentation">
            <path
              d="M26.9 42V26.7h5.2l.8-6h-6v-3.8c0-1.7.6-2.8 3-2.8h3.2V8.7c-.6-.1-2.5-.2-4.7-.2-4.7 0-7.9 2.9-7.9 8.1v4.1h-5.3v6h5.3V42h6.4Z"
              fill="white"
            />
          </svg>
        </span>
      </a>
      <a
        className="social-contact__link"
        href="https://zalo.me/0945046807"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat với MB Solar qua Zalo"
        title="Chat qua Zalo"
      >
        <span className="social-contact__icon social-contact__icon--zalo" aria-hidden="true">
          Zalo
        </span>
      </a>
      <a
        className="social-contact__link"
        href="tel:0945046807"
        aria-label="Gọi MB Solar qua số 094 504 68 07"
        title="Gọi MB Solar"
      >
        <span className="social-contact__icon social-contact__icon--phone" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" role="presentation">
            <path
              d="M7.2 3.8h2.5l1.2 4.1-1.8 1.8a14.6 14.6 0 0 0 5.2 5.2l1.8-1.8 4.1 1.2v2.5a2 2 0 0 1-2.2 2A16.2 16.2 0 0 1 5.2 6a2 2 0 0 1 2-2.2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="social-contact__phone-number" aria-hidden="true">
          094 504 68 07
        </span>
      </a>
    </nav>
  );
}
