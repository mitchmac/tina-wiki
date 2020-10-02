export default function EditLink(props) {
    let url = `/tina?slug=${props.slug}`
    return <a href={url} rel="nofollow">Edit page</a>
}