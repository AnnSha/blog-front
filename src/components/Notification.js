
const Notification = ({info}) => {
    if (!info) {
        return null
    }


    else if (info.type==='info'){
        return (
            <div className='info'>
                {info.message}
            </div>
        )}

    else if (info.type==='error') {
        return (
            <div className='error'>
                {info.message}
            </div>
        )
    }
}
export default Notification