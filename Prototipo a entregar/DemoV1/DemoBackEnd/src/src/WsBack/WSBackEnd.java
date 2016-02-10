package src.WsBack;

import java.io.IOException;
import java.io.StringReader;
import javax.json.Json;
import javax.json.JsonObject;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import src.Logica.Juego;


@ServerEndpoint("/demo")
public class WSBackEnd {

	
	
	@OnOpen
	public void handleOpen(Session sesion) throws IOException
	{
		System.out.println("Conectado...");
		sesion.getBasicRemote().sendText("Me llamaste");
		//System.out.println("Id: " + sesion.getId());
	}
	
	@OnMessage
	public void handleMessage(String message, Session ses) throws IOException 
	{
		//PARA RECIBIR MENSAJE Y MANDARSELO.
		JsonObject json = Json.createReader(new StringReader(message)).readObject();
		
		Juego j = new Juego();
		
		System.out.println("Recibido del cliente: " + message);
		
		j.setCx(json.get("x").toString());
		j.setCy(json.get("y").toString());
		j.setB(json.getString("b").toString());
	
		
		JsonObject resp =  Json.createObjectBuilder()
				.add("cx", j.getCx())
				.add("cy", j.getCy())
				.add("b", j.getB()).build();
		
		System.out.println("Se mando mensaje al cliente..." + resp.toString());
		
		for(Session s :ses.getOpenSessions())
		{
			s.getBasicRemote().sendText(resp.toString());
		}
		
		

	}
	
	@OnClose
	public void handleClose()
	{
		System.out.println("Desconectado...");
	}
	
	@OnError
	public void handleError(Throwable t)
	{
		t.printStackTrace();
	}
	
	
}
