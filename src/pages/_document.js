import Document, { Html, Head, Main, NextScript } from 'next/document'
import Typography from 'typography'
import { TypographyStyle } from 'react-typography'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        const typography = new Typography({
            baseFontSize: '18px'});
        return (
            <Html lang="en">
                <Head>
                    <TypographyStyle typography={typography} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument