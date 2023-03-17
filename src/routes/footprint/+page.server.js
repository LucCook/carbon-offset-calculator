import countriesArr from "$lib/server/countryData.json"

export const load = async () => {
    const fetchCountries = async() => {
        return countriesArr
    }
    return {countries: fetchCountries()}
}