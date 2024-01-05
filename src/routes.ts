import express from "express";
import { fillOrders } from "./controller";

interface Balances {
  [key: string]: number;
}

interface User {
  id: string;
  balances: Balances;
}

interface Order {
  userId: string;
  price: number;
  quantity: number;
}

export const TICKER = "GOOGLE";
export const users: User[] = [
  {
    id: "1",
    balances: {
      GOOGLE: 10,
      USD: 50000,
    },
  },
  {
    id: "2",
    balances: {
      GOOGLE: 10,
      USD: 50000,
    },
  },
];

export const bids: Order[] = [];
export const asks: Order[] = [];

export const setupRoutes = (app: any) => {
  app.get("/v1", (req: any, res: any) => {
    res.json("Welcome to Stock Exchange API!");
  });

  app.post("/v1/order", (req: any, res: any) => {
    const side: string = req.body.side;
    const price: number = req.body.price;
    const quantity: number = req.body.quantity;
    const userId: string = req.body.userId;

    const remainingQty = fillOrders(side, price, quantity, userId);

    if (remainingQty === 0) {
      res.json({ filledQuantity: quantity });
      return;
    }

    if (side === "bid") {
      bids.push({
        userId,
        price,
        quantity: remainingQty,
      });
      bids.sort((a, b) => (a.price < b.price ? -1 : 1));
    } else {
      asks.push({
        userId,
        price,
        quantity: remainingQty,
      });
      asks.sort((a, b) => (a.price < b.price ? 1 : -1));
    }

    res.json({
      filledQuantity: quantity - remainingQty,
    });
  });

  app.get("/v1/depth", (req: any, res: any) => {
    const depth: {
      [price: string]: {
        type: "bid" | "ask";
        quantity: number;
      };
    } = {};

    for (const element of bids) {
      if (!depth[element.price]) {
        depth[element.price] = {
          quantity: element.quantity,
          type: "bid",
        };
      } else {
        depth[element.price].quantity += element.quantity;
      }
    }

    for (const element of asks) {
      if (!depth[element.price]) {
        depth[element.price] = {
          quantity: element.quantity,
          type: "ask",
        };
      } else {
        depth[element.price].quantity += element.quantity;
      }
    }

    res.json({
      depth,
    });
  });

  app.get("/v1/balance/:userId", (req: any, res: any) => {
    const userId = req.params.userId;
    const user = users.find(x => x.id === userId);
    if (!user) {
      return res.json({
        USD: 0,
        [TICKER]: 0,
      });
    }
    res.json({ balances: user.balances });
  });
};
