import { withTina, useForm, usePlugin, useCMS } from 'tinacms'
import { InlineForm, InlineText } from 'react-tinacms-inline'

import Title from '../components/Title'

function Tina(props) {
    const cms = useCMS();

    const formConfig = {
        id: 'editor',
        loadInitialValues() {
            return getContent()
        },
        onSubmit(data, form) {
            console.log(data);
            cms.alerts.success('Saved!')
        }
    }

    async function getContent() {
        return {title: 'fooooo'}
    }

    const [_, form] = useForm(formConfig)
    usePlugin(form)

    return <div>
        <InlineForm form={form}>


            <Title><InlineText name="title" /></Title>



        </InlineForm>
    </div>

}

export default withTina(Tina, {
    enabled: true,
    toolbar: true
})