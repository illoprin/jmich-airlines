describe.skip("empty-array", () => {
	const arrayCase = (arr: any[]) => {
		if (!arr.length) {
			return null;
		}
		return arr;
	}

	const objectCase = (arr: any) => {
		return Object.keys(arr).length !== 0 || null;
	}

	const stringCase = (str: string) => {
		return !str ? null : str;
	}


	it("should return null", () => {
		expect(arrayCase([])).toBe(null);
	});

	it("should return null", () => {
		expect(objectCase({})).toBe(null);
	});

	it("should return null", () => {
		expect(stringCase("")).toBe(null);
	});

});