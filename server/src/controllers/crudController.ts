import { Request, Response, NextFunction } from "express";
import { Model, Document } from "mongoose";
import { createErrorResponse, CommonErrors } from "../utils/errors";
import logger from "../utils/logger";

export const createCrudController = <T extends Document>(Model: Model<T>) => ({
	add: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const doc = new Model(req.body);
			await doc.save();
			logger.info(`New ${Model.modelName} created`, { id: doc._id });
			res.status(201).json(doc);
		} catch (error) {
			logger.error(`Error creating ${Model.modelName}`, { error });
			next(createErrorResponse(CommonErrors.BAD_REQUEST, `Error creating ${Model.modelName}`, 400, error));
		}
	},

	list: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { populate, filter, sort, limit, skip, fields } = req.query;
			let query = Model.find(filter ? JSON.parse(String(filter)) : {});

			if (populate) {
				const populateOptions = String(populate)
					.split(",")
					.map((option) => {
						const [path, select] = option.split(":");
						return { path, select: select ? select.split(" ") : undefined };
					});
				populateOptions.forEach((option) => {
					query = query.populate(option);
				});
			}

			if (sort) query = query.sort(JSON.parse(String(sort)));
			if (limit) query = query.limit(Number(limit));
			if (skip) query = query.skip(Number(skip));
			if (fields) query = query.select(String(fields).split(" ").join(" "));

			const docs = await query.exec();
			logger.info(`Retrieved ${docs.length} ${Model.modelName}s`);
			res.json(docs);
		} catch (error) {
			logger.error(`Error listing ${Model.modelName}s`, { error });
			next(createErrorResponse(CommonErrors.SERVER_ERROR, `Error listing ${Model.modelName}s`, 500, error));
		}
	},

	get: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const { populate, fields } = req.query;
			let query = Model.findById(id);

			if (populate) {
				const populateOptions = String(populate)
					.split(",")
					.map((option) => {
						const [path, select] = option.split(":");
						return { path, select: select ? select.split(" ") : undefined };
					});
				populateOptions.forEach((option) => {
					query = query.populate(option);
				});
			}

			if (fields) query = query.select(String(fields).split(" ").join(" "));

			const doc = await query.exec();
			if (!doc) {
				logger.warn(`${Model.modelName} not found`, { id });
				return next(createErrorResponse(CommonErrors.NOT_FOUND, `${Model.modelName} not found`, 404));
			}
			logger.info(`Retrieved ${Model.modelName}`, { id });
			res.json(doc);
		} catch (error) {
			logger.error(`Error getting ${Model.modelName}`, { error, id: req.params.id });
			next(createErrorResponse(CommonErrors.SERVER_ERROR, `Error getting ${Model.modelName}`, 500, error));
		}
	},

	update: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const doc = await Model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
			if (!doc) {
				logger.warn(`${Model.modelName} not found for update`, { id });
				return next(createErrorResponse(CommonErrors.NOT_FOUND, `${Model.modelName} not found`, 404));
			}
			logger.info(`Updated ${Model.modelName}`, { id });
			res.json(doc);
		} catch (error) {
			logger.error(`Error updating ${Model.modelName}`, { error, id: req.params.id });
			next(createErrorResponse(CommonErrors.BAD_REQUEST, `Error updating ${Model.modelName}`, 400, error));
		}
	},

	remove: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const doc = await Model.findByIdAndDelete(id);
			if (!doc) {
				logger.warn(`${Model.modelName} not found for deletion`, { id });
				return next(createErrorResponse(CommonErrors.NOT_FOUND, `${Model.modelName} not found`, 404));
			}
			logger.info(`Deleted ${Model.modelName}`, { id });
			res.json({ message: `${Model.modelName} removed successfully` });
		} catch (error) {
			logger.error(`Error removing ${Model.modelName}`, { error, id: req.params.id });
			next(createErrorResponse(CommonErrors.SERVER_ERROR, `Error removing ${Model.modelName}`, 500, error));
		}
	},
});
