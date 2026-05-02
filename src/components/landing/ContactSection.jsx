import { motion } from "framer-motion";
import { GitFork, Link } from "lucide-react";
import Badge from "../Badge";
import { GITHUB_REPO, TEAM } from "../../constants/links";

function ContactSection() {
  return (
    <section id="contact" className="py-16 px-4 bg-breeze">
      <div className="max-w-4xl mx-auto text-center">
        <Badge color="bg-sunlit-deep">İLETİŞİM</Badge>
        <h2 className="text-4xl font-black mt-4 mb-3">İletişim</h2>
        <p className="font-bold text-shade-soft mb-10 max-w-xl mx-auto">
          Bu proje{" "}
          <span className="text-shade font-black">Kode X enerji hackathon</span>{" "}
          kapsamında geliştirilmiştir.
        </p>

        {/* GitHub Button */}
        <motion.a
          href={GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 bg-shade text-background border-4 border-slate-900 rounded-full font-bold px-8 py-3 shadow-[4px_4px_0px_0px_#555566] mb-10 hover:bg-shade-2 transition-colors"
        >
          <GitFork className="w-5 h-5" />
          GitHub'da İncele
        </motion.a>

        {/* Team LinkedIn Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEAM.map((member, i) => (
            <motion.a
              key={i}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
              className="bg-background border-4 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#2A2A33] cursor-pointer flex flex-col items-center gap-3 hover:bg-breeze-deep/10 transition-colors"
            >
              <div className="w-12 h-12 bg-breeze-deep border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-shade text-lg">
                {member.name[0]}
              </div>
              <div>
                <div className="font-black text-shade">{member.name}</div>
                <div className="flex items-center justify-center gap-1 mt-1 text-sm font-bold text-shade-soft">
                  <Link className="w-4 h-4" /> LinkedIn
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
