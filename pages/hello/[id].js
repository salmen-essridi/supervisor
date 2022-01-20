
import Link from 'next/link'


function Hello(props) {
  return (
    <>
    <div>Hello {props.time} ms </div>
      <Link href="/home">
        <a>to home</a>
      </Link>
    </>
  )
}


// This gets called on every request
export async function getServerSideProps({params}) {
  // Fetch data from external API

  let { id } = params
  const res = await fetch(`https://httpstat.us/200?sleep=${id}`)
  // Pass data to the page via props
  return { props: {  time : id } }
}
 
export default Hello