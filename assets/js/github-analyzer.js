// github-analyzer.js - GitHub Repository Analysis Engine
// Uses GitHub's public REST API (no auth token needed for public repos)

(function () {

  const GH_API = 'https://api.github.com';

  // ── Fetch Helpers ─────────────────────────────────────────────────────────
  async function ghFetch(path) {
    const res = await fetch(`${GH_API}${path}`, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `GitHub API error ${res.status}`);
    }
    return res.json();
  }

  // ── URL Parser ────────────────────────────────────────────────────────────
  function parseGitHubUrl(url) {
    url = url.trim().replace(/\.git$/, '');
    const m = url.match(/github\.com\/([^/]+)\/([^/?\s#]+)/);
    if (!m) throw new Error('Invalid GitHub URL. Format: https://github.com/owner/repo');
    return { owner: m[1], repo: m[2] };
  }

  // ── Scoring Helpers ───────────────────────────────────────────────────────
  function scoreReadme(content) {
    if (!content) return { score: 0, label: 'Missing', issues: ['No README found'] };
    const md  = atob(content).toLowerCase();
    const len = md.length;
    let score = 0; const issues = [];

    if (len > 500)   score += 20; else issues.push('README is very short (< 500 chars)');
    if (len > 2000)  score += 15;
    if (md.includes('## installation') || md.includes('## getting started')) score += 15;
    else issues.push('Missing installation / getting started section');
    if (md.includes('## usage') || md.includes('## how to use')) score += 10;
    else issues.push('Missing usage examples section');
    if (md.includes('## features')) score += 10;
    if (md.includes('screenshot') || md.includes('demo') || md.includes('gif')) score += 10;
    else issues.push('No screenshots or demo GIFs');
    if (md.includes('license')) score += 5;
    if (md.includes('## contributing')) score += 5;
    if (md.includes('## tech') || md.includes('built with') || md.includes('## stack')) score += 10;

    score = Math.min(score, 100);
    const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor';
    return { score, label, issues };
  }

  function scoreActivity(repo, commits) {
    let score = 0; const notes = [];
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at)) / 86400000;

    if (daysSinceUpdate < 7)   { score += 30; notes.push('Active this week'); }
    else if (daysSinceUpdate < 30) { score += 20; notes.push('Active this month'); }
    else if (daysSinceUpdate < 90) { score += 10; notes.push('Active this quarter'); }
    else notes.push(`Last updated ${Math.round(daysSinceUpdate)} days ago`);

    if (repo.stargazers_count >= 100) score += 25;
    else if (repo.stargazers_count >= 10) score += 15;
    else if (repo.stargazers_count >= 1)  score += 5;

    if (repo.forks_count >= 10) score += 15;
    else if (repo.forks_count >= 1) score += 8;

    if (commits && commits.length >= 10) score += 20;
    else if (commits && commits.length >= 5) score += 10;
    else notes.push('Few commits — may be early stage');

    if (repo.open_issues_count > 20) notes.push(`${repo.open_issues_count} open issues`);

    score = Math.min(score, 100);
    return { score, notes };
  }

  function scoreStructure(languages, topics, repo) {
    let score = 0; const notes = [];

    const langCount = Object.keys(languages || {}).length;
    if (langCount >= 3) { score += 20; notes.push(`${langCount} languages — good polyglot stack`); }
    else if (langCount >= 1) score += 10;

    if (topics && topics.names && topics.names.length > 0) {
      score += 15;
      notes.push(`Properly tagged: ${topics.names.slice(0,4).join(', ')}`);
    } else notes.push('No repository topics set');

    if (repo.license) { score += 15; notes.push(`Licensed: ${repo.license.name}`); }
    else notes.push('No license — add one for open source credibility');

    if (repo.description) score += 15; else notes.push('No repository description set');

    if (repo.homepage) { score += 10; notes.push('Has live demo / homepage link'); }
    else notes.push('No live demo link set');

    if (!repo.private) { score += 15; notes.push('Public repository'); }

    // Bonus for good naming
    if (repo.name.includes('-') || repo.name.includes('_')) score += 10;

    score = Math.min(score, 100);
    return { score, notes };
  }

  function detectStack(languages) {
    const langs = Object.keys(languages || {}).map(l => l.toLowerCase());
    const tags = [];
    if (langs.includes('python'))     tags.push({ name:'Python', color:'blue' });
    if (langs.includes('javascript')) tags.push({ name:'JavaScript', color:'yellow' });
    if (langs.includes('typescript')) tags.push({ name:'TypeScript', color:'primary' });
    if (langs.includes('rust'))       tags.push({ name:'Rust', color:'orange' });
    if (langs.includes('go'))         tags.push({ name:'Go', color:'cyan' });
    if (langs.includes('java'))       tags.push({ name:'Java', color:'red' });
    if (langs.includes('html'))       tags.push({ name:'HTML/CSS', color:'accent' });
    if (langs.includes('solidity'))   tags.push({ name:'Solidity', color:'purple' });
    if (langs.includes('swift'))      tags.push({ name:'Swift', color:'orange' });
    if (langs.includes('kotlin'))     tags.push({ name:'Kotlin', color:'purple' });
    return tags;
  }

  // ── Recommendation Generator ──────────────────────────────────────────────
  function buildRecommendations(readmeScore, activityScore, structureScore, repo) {
    const recs = [];
    if (readmeScore.score < 60) recs.push({ priority: 'High', text: 'Improve README — add sections for Installation, Usage, Screenshots, and Tech Stack.' });
    if (!repo.description)      recs.push({ priority: 'High', text: 'Add a clear repository description in GitHub Settings.' });
    if (!repo.homepage)         recs.push({ priority: 'High', text: 'Add a live demo link (GitHub Pages, Vercel, etc.) to boost portfolio impact.' });
    if (!repo.license)          recs.push({ priority: 'Medium', text: 'Add an open source license (MIT is standard for portfolio projects).' });
    if (activityScore.score < 40) recs.push({ priority: 'Medium', text: 'Repository appears inactive — commit at least weekly to show active development.' });
    if (structureScore.score < 50) recs.push({ priority: 'Medium', text: 'Add GitHub repository topics to improve discoverability.' });
    if (repo.open_issues_count > 5) recs.push({ priority: 'Low', text: `Close or label ${repo.open_issues_count} open issues to show project maintenance.` });
    if (recs.length === 0) recs.push({ priority: 'Low', text: 'Excellent repo! Consider writing a blog post or adding to your portfolio website.' });
    return recs;
  }

  // ── Overall Grade ─────────────────────────────────────────────────────────
  function getGrade(total) {
    if (total >= 85) return { grade: 'A+', label: 'Outstanding Portfolio Repo',    color: 'emerald' };
    if (total >= 75) return { grade: 'A',  label: 'Strong Portfolio Repo',         color: 'emerald' };
    if (total >= 65) return { grade: 'B',  label: 'Good — Minor Improvements Needed', color: 'primary' };
    if (total >= 50) return { grade: 'C',  label: 'Fair — Needs Work',             color: 'amber'   };
    if (total >= 35) return { grade: 'D',  label: 'Weak — Major Gaps',             color: 'rose'    };
    return                   { grade: 'F',  label: 'Poor — Needs Full Overhaul',   color: 'rose'    };
  }

  // ── Main Entry Point ──────────────────────────────────────────────────────
  async function analyzeRepo(url) {
    const { owner, repo: repoName } = parseGitHubUrl(url);

    // Parallel fetch everything
    const [repo, languages, topicsRes, commitsRes, readmeRes] = await Promise.allSettled([
      ghFetch(`/repos/${owner}/${repoName}`),
      ghFetch(`/repos/${owner}/${repoName}/languages`),
      ghFetch(`/repos/${owner}/${repoName}/topics`),
      ghFetch(`/repos/${owner}/${repoName}/commits?per_page=10`),
      ghFetch(`/repos/${owner}/${repoName}/contents/README.md`),
    ]);

    if (repo.status === 'rejected') throw new Error(repo.reason?.message || 'Repository not found or is private.');

    const repoData    = repo.value;
    const langs       = languages.status === 'fulfilled' ? languages.value : {};
    const topics      = topicsRes.status === 'fulfilled' ? topicsRes.value : { names: [] };
    const commits     = commitsRes.status === 'fulfilled' ? commitsRes.value : [];
    const readmeData  = readmeRes.status === 'fulfilled' ? readmeRes.value : null;

    // Sub-scores
    const readme      = scoreReadme(readmeData?.content);
    const activity    = scoreActivity(repoData, commits);
    const structure   = scoreStructure(langs, topics, repoData);

    // Weighted total (readme 35%, activity 35%, structure 30%)
    const totalScore  = Math.round(readme.score * 0.35 + activity.score * 0.35 + structure.score * 0.30);
    const grade       = getGrade(totalScore);
    const stack       = detectStack(langs);
    const recommendations = buildRecommendations(readme, activity, structure, repoData);

    // Recent commit messages
    const recentCommits = (commits || []).slice(0, 5).map(c => ({
      message: c.commit.message.split('\n')[0].slice(0, 80),
      date:    new Date(c.commit.author.date).toLocaleDateString(),
      author:  c.commit.author.name,
    }));

    return {
      repo: {
        name:        repoData.name,
        fullName:    repoData.full_name,
        description: repoData.description,
        url:         repoData.html_url,
        homepage:    repoData.homepage,
        stars:       repoData.stargazers_count,
        forks:       repoData.forks_count,
        watchers:    repoData.watchers_count,
        openIssues:  repoData.open_issues_count,
        language:    repoData.language,
        license:     repoData.license?.name,
        topics:      topics.names || [],
        createdAt:   repoData.created_at,
        updatedAt:   repoData.updated_at,
        isPrivate:   repoData.private,
      },
      scores: { readme: readme.score, activity: activity.score, structure: structure.score, total: totalScore },
      grade,
      stack,
      readme,
      activity,
      structure,
      recommendations,
      recentCommits,
      languages: langs,
    };
  }

  window.GitHubAnalyzer = { analyzeRepo, parseGitHubUrl };

})();
