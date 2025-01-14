import Image from 'next/image';
import { css } from '../../styled-system/css';

export default function Home() {
  return (
    <div className={css({ display: 'flex', flexDir: 'column', minH: '100vh' })}>
      <main
        className={css({
          flex: 1,
          display: 'flex',
          flexDir: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: '4',
        })}
      >
        <Image
          className={css({ maxW: '100%', h: 'auto' })}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className={css({ mt: '4', listStyleType: 'decimal', pl: '6' })}>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={css({ display: 'flex', gap: '4', mt: '8' })}>
          <a
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              px: '4',
              py: '2',
              bg: 'slate.900',
              color: 'white',
              rounded: 'md',
              _hover: { bg: 'slate.700' },
            })}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              px: '4',
              py: '2',
              border: '1px solid',
              borderColor: 'slate.200',
              rounded: 'md',
              _hover: { bg: 'slate.100' },
            })}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer
        className={css({
          display: 'flex',
          justifyContent: 'center',
          gap: '6',
          py: '4',
          borderTop: '1px solid',
          borderColor: 'slate.200',
        })}
      >
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
