import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'

const Chart = dynamic(
  () => import('../components/chart2'),
  { ssr: false }
)


export default function Home() {
  return (
     <>
     <Chart />
    </>
  )
}
