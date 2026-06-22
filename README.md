```mermaid
graph LR

    User([User])

    WebApp[Web App]
    Cognito[Cognito UserPool]
    Agent[AgentCore Agent]
    LLM[LLM]
    Gateway[AgentCore Gateway]
    Lambda[Tools Lambda]

    User --> WebApp

    WebApp --> Agent
    WebApp -. OAuth .-> Cognito
    Cognito -.-> Agent

    Agent --> LLM
    Agent -- MCP --> Gateway
    Gateway --> Lambda

    classDef purple fill:#4B2E83,color:#fff,stroke:#fff;
    classDef green fill:#2E8B57,color:#fff,stroke:#fff;

    class WebApp,Cognito,Agent,LLM,Lambda purple;
    class Gateway green;
```

## Cognito login setup

This app now signs users in against an AWS Cognito User Pool. Create a local `.env` file with these values:

```env
VITE_AWS_REGION=ap-south-1
VITE_AWS_COGNITO_USER_POOL_ID=ap-south-1_XXXXXXXXX
VITE_AWS_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

Then restart the Vite dev server. The login page will authenticate the Cognito user and open the normal chat app after a successful sign-in.