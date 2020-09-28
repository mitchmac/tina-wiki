import { withTina, useForm, usePlugin, useCMS } from 'tinacms'
import { InlineForm, BlocksControls, InlineBlocks, InlineText } from 'react-tinacms-inline'
import { InlineWysiwyg } from 'react-tinacms-editor'

import Title from '../components/Title'
import Body from '../components/Body'

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
        const res = await fetch('https://gitlab.com/api/v4/projects/mitchmac%2Fwiki-test/repository/files/content%2Fhi.json/raw?ref=master');
        return await res.json();
    }

    const [_, form] = useForm(formConfig)
    usePlugin(form)

    //
    return <div>
        <InlineForm form={form}>
            <InlineBlocks name="blocks" blocks={PAGE_BLOCKS} />
        </InlineForm>
    </div>

}

export function InlineTitle(props) {
    return (
        <BlocksControls index={props.index}>
            <Title><InlineText name="value" /></Title>
        </BlocksControls>
    )
}

//props.data._template
export function InlineBody(props) {
    return (
        <BlocksControls index={props.index}>
            <Body><InlineText name="value" /></Body>
        </BlocksControls>
    )
}

const PAGE_BLOCKS = {
    Title: {
        Component: InlineTitle,
        template: {label: 'Title'}
    },
    Body: {
        Component: InlineBody,
        template: {label: 'Body'}
    }
};

export default withTina(Tina, {
    enabled: true,
    toolbar: true
})