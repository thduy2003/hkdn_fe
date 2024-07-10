import uehCover from '@/assets/ueh_cover.png'

function Login() {
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#f2f2f2]">
           <div className={`bg-[url('./src/assets/ueh_cover.png')] w-[calc(100%_-_560px)] bg-no-repeat bg-cover bg-center z-[1]`}>
           </div>
           <div className='w-[560px] min-h-screen block bg-[#f7f7f7] p-[55px]'></div>
        </div>
      )
}
export default Login;