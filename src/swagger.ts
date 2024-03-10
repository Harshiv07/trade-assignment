import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

export const setupSwagger = (app: any) => {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Stock Exchange API",
        version: "1.0.0",
        description: "API for managing stock exchange orders and balances",
      },
      servers: [
        {
          url: "https://trade-orderbook-api.vercel.app/",
        },
      ],
      paths: {
        "/v1": {
          get: {
            summary: "Welcome message",
            description: "Returns a welcome message.",
            responses: {
              200: {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: { message: "Welcome to Stock Exchange API!" },
                  },
                },
              },
            },
          },
        },
        "/v1/order": {
          post: {
            summary: "Place a limit order",
            description: "Place a limit order for stock exchange.",
            requestBody: {
              content: {
                "application/json": {
                  example: {
                    side: "bid",
                    price: 100,
                    quantity: 5,
                    userId: "1",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Order placed successfully",
                content: {
                  "application/json": {
                    example: { filledQuantity: 5 },
                  },
                },
              },
            },
          },
        },
        "/v1/depth": {
          get: {
            summary: "Get order book depth",
            description: "Retrieve the order book depth.",
            responses: {
              200: {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: {
                      depth: {
                        "100": { type: "bid", quantity: 10 },
                        "105": { type: "ask", quantity: 5 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/v1/balance/{userId}": {
          get: {
            summary: "Get user balance",
            description: "Retrieve the balance of a specific user.",
            parameters: [
              {
                name: "userId",
                in: "path",
                required: true,
                description: "ID of the user",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Successful response",
                content: {
                  "application/json": {
                    example: {
                      balances: { USD: 50000, GOOGLE: 10 },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    apis: ["./routes.ts"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  const CSS_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css";
  const JS_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js";

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      customCssUrl: CSS_URL,
      swaggerOptions: { urls: [{ url: JS_URL, name: "Swagger UI Bundle" }] },
    })
  );
};
