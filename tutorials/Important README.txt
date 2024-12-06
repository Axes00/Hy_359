Εγκαταστάσεις

Εγώ χρησιμοποιώ Netbeans 12.4 και Tomcat 10.0.11
	Video εγκατάστασης για netbeans https://www.youtube.com/watch?v=yVZ50vz5UuU
	
	Video εγκατάστασης για eclipse https://www.youtube.com/watch?v=jvthzN9Zqic
	
	Video εγκατάστασης για intellij https://www.youtube.com/watch?v=kG8dJLnPn8o


Επίσης σε πολλούς μπορεί να προκύψει το εξής πρόβλημα, να μην τους κάνει import τα jakarta

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

Σε αυτές τις περιπτώσεις βάζετε τα αντίστοιχα πακέτα σε javax
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse