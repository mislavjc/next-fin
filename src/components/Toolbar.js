import Link from "next/link";
import { useRouter } from "next/router";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Chip from "@material-ui/core/Chip";
import TocIcon from "@material-ui/icons/Toc";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ArchiveIcon from "@material-ui/icons/Archive";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";

export const Toolbar = ({ search, setSearch, owner }) => {
  const router = useRouter();

  return (
    <div className="toolbar">
      <div>
        <Link href="/all-items" passHref>
          <Chip
            icon={<DashboardIcon />}
            label="Kartični pregled"
            variant={router.asPath === "/all-items" ? "default" : "outlined"}
            color="primary"
          />
        </Link>
      </div>
      <div>
        <Link href="/table" passHref>
          <Chip
            icon={<TocIcon />}
            label="Tablični pregled"
            variant={router.asPath === "/table" ? "default" : "outlined"}
            color="primary"
          />
        </Link>
      </div>
      <div>
        <Link href="/all-items/archived" passHref>
          <Chip
            icon={<ArchiveIcon />}
            label="Arhivirani unosi"
            variant={
              router.asPath === "/all-items/archived" ? "default" : "outlined"
            }
            color="primary"
          />
        </Link>
      </div>
      <Paper className="search">
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          disabled={!owner.option}
          className="search"
          placeholder="Pretražite unose"
          inputProps={{ "aria-label": "pretražite unose" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>
    </div>
  );
};
