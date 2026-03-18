import { Client, Account, Query, TablesDB, ID } from "appwrite";

type Movie = {
  id: number;
  poster_path: string;
};

const apiEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const tableId = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client().setEndpoint(apiEndpoint).setProject(projectId);

const account = new Account(client);
const tables = new TablesDB(client);
const updateSearchcount = async (searchTerm: string, movie: Movie) => {
  try {
    const result = await tables.listRows({
      databaseId: databaseId,
      tableId: tableId,
      queries: [Query.equal("search_term", searchTerm)],
    });

    if (result.rows.length > 0) {
      const row = result.rows[0];

      await tables.updateRow({
        databaseId: databaseId,
        tableId: tableId,
        rowId: row.$id,
        data: {
          count: row.count + 1,
        },
      });
    } else {
      await tables.createRow({
        databaseId: databaseId,
        tableId: tableId,
        rowId: ID.unique(),
        data: {
          search_term: searchTerm,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w600_and_h900_face${movie.poster_path}`,
          count: 1,
        },
      });
    }

    console.log(`Searching for term: ${searchTerm}`, result);
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

import type { Models } from "appwrite";

export type TopMovieRow = Models.Row & {
  search_term: string;
  movie_id: number;
  poster_url: string;
  count: number;
};

const getTopMovies = async (): Promise<TopMovieRow[]> => {
  try {
    const result = await tables.listRows<TopMovieRow>({
      databaseId: databaseId,
      tableId: tableId,
      queries: [Query.orderDesc("count"), Query.limit(6)],
    });
    return result.rows;
  } catch (error) {
    console.error("Error fetching top movies:", error);
    return [];
  }
};

export { client, account, updateSearchcount, getTopMovies };
