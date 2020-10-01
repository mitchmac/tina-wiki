export default function EditLink(props) {
    let url = `/tina?slug=${props.slug}`
    return <a href={url}>Edit page</a>
}