import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async showAll(req: Request, res: Response) {
    const points = await knex("points").select("*");
    return res.json(points);
  }

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "point_id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://192.168.8.107:3333/uploads/${point.image}`,
      };
    });

    return res.json(serializedPoints);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex("points").where("id", id).first();
    if (!point) {
      return res.status(400).json({ message: "Point not found" });
    }

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.8.107:3333/uploads/${point.image}`,
    };

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return res.json({ point: serializedPoint, items });
  }

  async showWItems(req: Request, res: Response) {
    const { city, uf } = req.query;

    const points = await knex("points")
      .join("point_items", "point_id", "=", "point_items.point_id")
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://192.168.10.104:3333/uploads/${point.image}`,
      };
    });

    const promises = await points.map(async (point) => {
      const itemsTemp = await knex("items")
        .join("point_items", "items.id", "=", "point_items.item_id")
        .where("point_items.point_id", point.id)
        .select("items.title");
      return itemsTemp;
    });

    const itemsPoints = await Promise.all(promises).then((results) => results);

    return res.json({ points: serializedPoints, items: itemsPoints });
  }

  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    const point = {
      image: req.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const trx = await knex.transaction();

    const insertedIds = await trx("points").insert(point);

    const point_id = insertedIds[0];

    const pointItems = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id: point_id,
        };
      });

    await trx("point_items").insert(pointItems);

    await trx.commit();

    return res.json({ id: point_id, ...point });
  }
}

export default PointsController;
