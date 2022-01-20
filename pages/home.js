
import Link from 'next/link'


export default function Index() {
  return (

    <>
      <Link href="/hello/9000">
        <a>to hello 9s</a>
      </Link><br></br><br/>
      <Link href="/hello/3000">
        <a>to hello 3s</a>
      </Link>

    </>
  )
}
