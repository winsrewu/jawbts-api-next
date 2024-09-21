/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:anything*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: '*',
                    }
                ],
            }
        ]
    },
    experimental: {
        instrumentationHook : true,
    },
    target: "serverless",
}



module.exports = nextConfig
