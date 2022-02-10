import React, { useEffect, useState } from "react";
//@ts-ignore
import ApiCalendar from "react-google-calendar-api";

import { Button, Divider, TextField } from "@mui/material";
import DataView from "~/components/DataView";
import { Box } from "@mui/material";

const severance_id =
  "_6t33ahi46op3iba175344b9k88o4aba16crj6b9o8kp32gi66gs3agq46o";
const practice_id = "4t3haek3gbd669ak3f2ftpf003";

const GC_login_logout: React.FC = () => {
  const [calEvents, setCalEvents] = useState<any>();
  const [summary, setSummary] = useState("");
  const [eventId, setEventId] = useState("");

  const handleSignIn = () => {
    ApiCalendar.handleAuthClick().then(() => {
      console.log("sign in success");
    });
  };
  const handleSignOut = () => {
    ApiCalendar.handleSignoutClick();
  };
  const listEvents = () => {
    if (ApiCalendar.sign) {
      ApiCalendar.listUpcomingEvents(10).then(({ result }: any) => {
        console.log("result", result);
        console.log(result.items);
        setCalEvents(result.items);
      });
    }
  };
  const getEvent = (event_id: string) => {
    if (ApiCalendar.sign) {
      ApiCalendar.getEvent(event_id).then(({ result }) => {
        console.log(result);
        setSummary(result.summary);
        setEventId(result.id);
      });
    }
  };
  const updateEvent = () => {
    const event = {
      summary,
    };

    ApiCalendar.updateEvent(event, eventId).then(console.log);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleSignIn}>
        login
      </Button>
      <Button variant="outlined" onClick={handleSignOut}>
        logout
      </Button>
      <Button variant="outlined" onClick={listEvents}>
        list events
      </Button>
      <Box sx={{ p: 2 }}>
        <Button variant="outlined" onClick={() => getEvent(practice_id)}>
          get prac
        </Button>
        <Button variant="outlined" onClick={() => getEvent(severance_id)}>
          get sev
        </Button>
        <TextField
          value={summary}
          onChange={(e) => {
            setSummary(e.target.value);
          }}
          label="summary"
        />
        <Button variant="contained" onClick={updateEvent}>
          save
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <DataView data={calEvents} title="show events" />
    </div>
  );
};

export default GC_login_logout;
