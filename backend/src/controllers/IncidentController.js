const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const incidents = await connection("incidents").select("*");

        return response.json(incidents);
    },

    async create(request, response) {
        const { title, description, value } = request.body;

        /** retorna o id do usuario autenticado */
        const hospital_id = request.headers.authorization;

        /** Retorna o id do cadastro realizado e armazena a chave do array
         *  e armaneza nessa variável id  */
        const [id] = await connection("incidents").insert({
            title,
            description,
            value,
            hospital_id,
        });

        return response.json({ id });
    },

    async delete(request, response) {
        // retorna o id da request da rota
        const { id } = request.params;

        // retorna o id da hospital logado
        const hospital_id = request.headers.authorization;

        const incident = await connection("incidents")
            .where("id", id)
            .select("hospital_id")
            .first();

        // verifica se o hospital logado é o mesmo que está tentando excluid o registro
        if (incident.hospital_id != hospital_id) {
            return response.status(401).json({ error: "Operation not permitted." });
        }

        // caso seja o mesmo realiza o delete
        await connection("incidents").where("id", id).delete();

        return response.status(204).send();
    }
};