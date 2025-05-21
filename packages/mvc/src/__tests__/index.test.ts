import { newReadonlyModel } from "..";

describe("newReadonlyModel", () => {
	it("outputs model with equivalent model view", () => {
		const modelView = { name: "Jonathan", surname: "Pageau" };
		const model = newReadonlyModel(modelView);

		expect(model.modelView).toEqual(modelView);
	});
});
