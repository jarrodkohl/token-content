import Image from 'next/image'
import { Logo } from '../components/Logo'
import HeroImage from '../public/hero.webp'
import Link from 'next/link'

export default function Home() {

  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center">
      <Image src={HeroImage} alt="Hero Image" layout="fill" objectFit="cover" />
      <div className='relative z-10 text-white px-10 py-5 text-center max-w-screen bg-slate-900/90 rounded-md backdrop-blur-sm'>
        <Logo />
        <p>Ai powered Blog and Social Media content</p>
        <Link href='/post/new' className='btn'>Get Started</Link>
      </div>
    </div>
  )
}
