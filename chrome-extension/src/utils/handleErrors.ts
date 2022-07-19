export default function handleErrors(fun: Function) {
  try {
    fun();
  }
  catch(e) {
    console.error("=== UNHANDLED EXCEPTION: ", e)
  }
}